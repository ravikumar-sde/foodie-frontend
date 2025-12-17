//POST request for users
const express = require("express");
const multer = require("multer");
const router = new express.Router();
const Users = require("../Models/users.js");
const auth = require("../Middleware/auth.js");
const expError = require("../utils/expError.js");
const catchAsyncError = require("../utils/asyncError.js");

router.post(
    "/users/signup",
    catchAsyncError(async (req, res) => {

        const checkUserExistsOrNot = await Users.findOne({
            email: req.body.email
        });

        if (checkUserExistsOrNot) throw new expError({ message: "Email already exists", statusCode: 401 })
        const user = new Users(req.body);

        const token = await user.generateTokens();
        await user.save();

        res.status(201).send({ user, token });
    })
);  

router.post(
    "/users/login",
    catchAsyncError(async (req, res) => {
        const user = await Users.findByCredentials(
            req.body.email,
            req.body.password
        );

        const token = await user.generateTokens();
        res.status(200).send({ user, token });
    })
);

//Logout single user
router.post(
    "/users/logout",
    auth,
    catchAsyncError(async (req, res) => {
        req.user.Tokens = req.user.Tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.send({ data: "logged out" });
    })
);

//logout from all devices
router.post(
    "/users/logoutAll",
    auth,
    catchAsyncError(async (req, res) => {
        req.user.Tokens = [];

        await req.user.save();
        res.send();
    })
);

//GET request for finding current user (must come before /users)
router.get(
    "/users/me",
    auth,
    catchAsyncError(async (req, res) => {
        const me = await req.user.populate('following');
        res.status(200).send(me);
    })
);

//GET request for finding all users
router.get(
    "/users",
    auth,
    catchAsyncError(async (req, res) => {
        const users = await Users.find({}).populate('followers').populate('following');
        res.status(200).send(users);
    })
);

router.patch(
    "/users/me",
    auth,
    catchAsyncError(async (req, res) => {
        const updates = Object.keys(req.body);
        const validInput = ["fullname", "phone", "email", "password"];
        const isvalidInput = updates.every((update) => validInput.includes(update));

        if (!isvalidInput)
            throw new expError({ message: "Invalid Input", statusCode: 400 });

        updates.forEach((update) => {
            req.user[update] = req.body[update];
        });

        await req.user.save();

        res.status(200).send({ user: req.user });
    })
);

//Deleting colletion from database by using id
router.delete(
    "/users/me",
    auth,
    catchAsyncError(async (req, res) => {
        await Tasks.findByIdAndDelete({ owner: req.user._id });
        await req.user.remove();
        res.status(200).send({ user: req.user });
    })
);

//Files upload feature
const avatar = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|avif)$/)) {
            return callback(new Error("Please upload jpg, jpeg or png format"));
        }

        callback(undefined, true);
    },
});

router.post(
    "/users/me/avatar",
    auth,
    avatar.single("avatar"),
    catchAsyncError(async (req, res) => {
        req.user.avatar = req.file.buffer;
        await req.user.save();
        res.send({ data: "uploaded successfully", id: req.user._id });
    })
);

router.delete(
    "/users/me/avatar",
    auth,
    avatar.single("avatar"),
    catchAsyncError(async (req, res) => {
        req.user.avatar = undefined;
        await req.user.save();
        res.send({ data: "Removed successfully" });
    })
);

router.get("/users/:id", catchAsyncError(async (req, res) => {
    const user = await Users.findById(req.params.id).populate('following').populate('followers').populate('bookmarks');
    if(!user) throw new expError({message: "user not found", statusCode: 404});

    res.status(200).send(user);
}))

router.get(
    "/users/:id/avatar",
    catchAsyncError(async (req, res) => {
        const user = await Users.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new expError({ message: "No Avatar found", statusCode: 400 });
        }
        res.set("Content-type", "image/jpg");
        res.send(user.avatar);
    })
);

router.get(
    "/users/:id/bookmarks",
    catchAsyncError(async (req, res) => {
        const user = await Users.findById(req.params.id).populate('bookmarks');
        res.status(200).send({ bookmarks: user.bookmarks });
    })
);

router.post(
    "/users/:id/follow",
    auth,
    catchAsyncError(async (req, res) => {
        const user = await Users.findById(req.params.id);

        const me = await req.user.populate('following');

        const duplicate = me.following.filter(following => {
            return following.email === user.email;
        });

        if(duplicate.length !== 0) {
            throw new expError({message: 'Already following', statusCode: 400});
        }

        user.followers.push(req.user);
        me.following.push(user);
        await req.user.save();
        await user.save();

        res.status(201).send({ success: `you are now following ${user.fullname}` });
    })
);

router.get(
    "/users/:id/follow",
    catchAsyncError(async (req, res) => {
        const user = await Users.findById(req.params.id).populate('followers').populate('following');
        if(!user) throw new expError({ message: 'user not found', statusCode: 404})

        res.status(200).send(user);
    })
);

router.delete(
    "/users/:id/follow",
    auth,
    catchAsyncError(async (req, res) => {
        const user = await Users.findById(req.params.id).populate('followers');

        if(!user) throw new expError({ message: 'user not found', statusCode: 404});

        const me = await req.user.populate('following');

        me.following = me.following.filter(following => {
            return following.email !== user.email;
        });

        user.followers = user.followers.filter(follower => {
            return follower.email !== me.email
        });

        await me.save();
        await user.save();

        res.status(200).send({success: 'Unfollow successfully'});
    })
);

module.exports = router;