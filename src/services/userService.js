import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
};

const checkUserEmail = async (userEmail) => {
    try {
        const user = await db.User.findOne({
            where: { email: userEmail }
        });
        return !!user;
    } catch (error) {
        throw new Error('Error checking user email');
    }
};

const createNewUserService = async (data) => {
    try {
        const emailExists = await checkUserEmail(data.email);
        if (emailExists) {
            return {
                status: 1,
                message: 'Email của bạn đã được sử dụng, vui lòng thử email khác!'
            };
        }

        const hashPasswordFromBcrypt = await hashUserPassword(data.password);

        let roleToSave = data.roleCheck === 'R1' ? 'R2' : 'R3';

        await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            name: data.name,
            phoneNumber: data.phoneNumber,
            address: data.address,
            avatar: data.avatar,
            role: roleToSave,
            status: 'S1'
        });

        return {
            status: 0,
            message: 'Tạo tài khoản mới thành công!'
        };
    } catch (error) {
        throw new Error('Error creating new user');
    }
};

const loginUserService = async (data, res) => {

    try {
        if (!data.email || !data.password) {
            return {
                status: 1,
                message: 'Thiếu thông số bắt buộc!'
            };
        }

        const user = await db.User.findOne({
            where: { email: data.email },
            attributes: ['id', 'email', 'password', 'name', 'phoneNumber', 'address', 'role', 'status'],
            raw: true
        });

        if (!user) {
            return {
                status: 2,
                message: 'Không tìm thấy người dùng!'
            };
        }

        const passwordMatches = await bcrypt.compare(data.password, user.password);
        if (!passwordMatches) {
            return {
                status: 3,
                message: 'Sai mật khẩu!'
            };
        }

        if (user.status === 'S2') {
            return {
                status: 4,
                message: 'Người dùng bị chặn!'
            };
        }
        if (data.check === 'admin' && !['R1', 'R2'].includes(user.role)) {
            return {
                status: 5,
                message: 'Bạn không có quyền truy cập!'
            };
        }

        const token = jwt.sign({ _id: user.id }, "secret");

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        delete user.password;

        return {
            status: 0,
            message: 'Đăng nhập thành công!',
            user: user,
        };
    } catch (error) {
        throw new Error('Error logging in user');
    }
};

const getMeService = async (cookie) => {

    try {
        const claims = jwt.verify(cookie, 'secret');
        if (!claims) {
            return {
                status: 1,
                message: 'Không được xác thực!'
            };
        }

        const user = await db.User.findOne({
            where: { id: claims._id },
            raw: true
        });

        if (!user) {
            return {
                status: 2,
                message: 'Người dùng không tồn tại!'
            };
        }

        const { password, ...userData } = user;
        return {
            status: 0,
            data: userData
        };
    } catch (error) {
        throw new Error('Error getting user information');
    }
};

const getAllUserService = async (pageNumber, search, selected) => {

    const pageSize = 20;

    try {
        const allUsers = await db.User.findAll({
            attributes: { exclude: ['password'] }
        });

        let filteredUsers = allUsers;

        if (search) {
            filteredUsers = filteredUsers.filter(user =>
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (selected !== 'ALL') {
            filteredUsers = filteredUsers.filter(user => {
                if (selected === 'R2' || selected === 'R3') {
                    return user.role === selected;
                } else if (selected === 'S1' || selected === 'S2') {
                    return user.status === selected;
                }
                return true;
            });
        }

        const sortedUsers = filteredUsers.sort((a, b) => {
            if (a.status === 'S2' && b.status !== 'S2') {
                return 1;
            }
            if (a.status !== 'S2' && b.status === 'S2') {
                return -1;
            }
            if (a.role === 'R2' && b.role !== 'R2') {
                return -1;
            }
            if (a.role !== 'R2' && b.role === 'R2') {
                return 1;
            }
            return 0;
        });

        const offset = (pageNumber - 1) * pageSize;
        const paginatedUsers = sortedUsers.slice(offset, offset + pageSize);

        const totalCount = sortedUsers.length;

        const data = {
            users: paginatedUsers,
            totalCount: totalCount
        };

        return {
            status: 0,
            data: data
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Error fetching users');
    }
};

const getUserByIdService = async (userId) => {
    try {
        const user = await db.User.findOne({
            where: { id: userId },
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return {
                status: 1,
                message: 'Không tìm thấy người dùng!'
            };
        }

        return {
            status: 0,
            data: user
        };
    } catch (error) {
        throw new Error('Error fetching user by ID');
    }
};

const updateUserService = async (data) => {
    try {
        const user = await db.User.findOne({
            where: { id: data.id },
            raw: false
        });

        if (!user) {
            return {
                status: 1,
                message: 'Người dùng không tồn tại!'
            };
        }

        user.name = data.name;
        user.phoneNumber = data.phoneNumber;
        user.address = data.address;
        user.status = data.status;

        if (data.password) {
            const hashPasswordFromBcrypt = await hashUserPassword(data.password);
            user.password = hashPasswordFromBcrypt;
        }

        if (data.avatar) {
            user.avatar = data.avatar;
        }

        await user.save();

        return {
            status: 0,
            message: 'Cập nhật người dùng thành công!'
        };

    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Cập nhật người dùng thất bại!');
    }
};


const logoutService = async (res) => {
    try {
        res.clearCookie('jwt');
        return {
            status: 0,
            message: 'Đăng xuất thành công!'
        };
    } catch (error) {
        throw new Error('Error logging out user');
    }
};

module.exports = {
    createNewUserService,
    loginUserService,
    getMeService,
    getAllUserService,
    logoutService,
    getUserByIdService,
    updateUserService
};
