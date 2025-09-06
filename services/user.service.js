import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import createToken from "../utils/create-token.js";
import {BadRequestError, NotFoundError} from "../utils/api-errors.js";
import BaseService from "./base.service.js";

class UserService {
    #BaseService
    #User

    constructor(BaseService, User) {
        this.#BaseService = BaseService;
        this.#User = User;
    }

    async getUser(id) {
        return await this.#BaseService.getOne(this.#User, id)
    }

    async getAllUsers() {
        return await this.#BaseService.getAll(this.#User)
    }

    async createUser(data) {
        return await this.#BaseService.create(this.#User, data)
    }

    async updateUser(data) {
        return await this.#BaseService.update(this.#User, data)
    }

    async deleteUser(id) {
        return await this.#BaseService.delete(this.#User, id)
    }

    async changePassword(id, currPassword, newPassword) {
        let user = await this.#User.findOne(id)

        if (!user.comparePassword(currPassword, user.password)) throw new BadRequestError("Password is incorrect")

        const hashedPassword = await bcrypt.hash(newPassword, 10);

       await User.findByIdAndUpdate(id, {
            password: hashedPassword,
            passwordChangeAt: Date.now()
        }, {new: true});

        return createToken(user._id);
    }

    async updateLoggedUserData(id, data) {
        const user = await User.findByIdAndUpdate(id, {...data}, {new: true}).lean();

        if (!user) throw new NotFoundError("User not found");

        return user;
    }

    async deactivateUser(id) {
        return await User.findByIdAndUpdate(id, {
            isActive: false,
        }, {new: true}).lean();
    }
}

export default new UserService(BaseService, User);