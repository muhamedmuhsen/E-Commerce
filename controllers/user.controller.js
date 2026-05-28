import UserService from "../services/user.service.js";
import asyncWrapper from "../middlewares/async-wrapper.js";

class UserController {
    #UserService

    constructor(UserService) {
        this.#UserService = UserService;
    }

    wrap(fn){
        return asyncWrapper(fn.bind(this));
    }

    async getUsers(req, res) {
        const users = await this.#UserService.getAllUsers();

        res.status(200).json({
            success: true, message: "Users retrieved successfully", data: users,
        });
    }

    async getUser(req, res) {
        const user = await this.#UserService.getUser(req.params.id);
        res.status(200).json({
            success: true, message: "User retrieved successfully", data: user,
        })
    }

    async createUser(req, res) {
        const user = await this.#UserService.createUser(req.body);

        res.status(201).json({
            success: true, message: "User created successfully", data: user,
        })
    }

    async updateUser(req, res) {
        const user = await this.#UserService.updateUser(req.params.id, req.body);
        res.status(200).json({
            success: true, message: "User updated successfully", data: user,
        })
    }

    async deleteUser(req, res) {
        const user = await this.#UserService.deleteUser(req.params.id);
        res.status(200).json({
            success: true, message: "User deleted successfully",
        })
    }

    async updateLoggedUserData(req, res) {
        const user = await this.#UserService.updateLoggedUserData(req.user._id, req.body);
        res.status(200).json({success: true, message: "user updated successfully", data: user});
    }

    async changePassword(req, res) {
        const token = await this.#UserService.changePassword(req.user._id, req.body.password, req.body.newPassword);
        res.status(200).json({success: true, message: "Password changed successfully", token});
    }

    getLoggedUser(req, res, next) {
        req.params.id = req.user._id;
        next();
    }

    async deactivateUser(req, res) {
        await this.#UserService.deactivateUser(req.params.id);
        res
            .status(200)
            .json({success: true, message: "Account deactivated successfully."});
    }
}

export default new UserController(UserService);