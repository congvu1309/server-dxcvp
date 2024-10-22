import db from '../models/index';

const createNewProductService = async (data) => {

    try {
        const requiredFields = ['userId', 'title', 'provinces', 'districts', 'price', 'guests', 'bedrooms', 'beds', 'bathrooms', 'checkIn', 'checkOut', 'description'];
        for (const field of requiredFields) {
            if (!data[field]) {
                return {
                    status: 1,
                    message: `Thiếu thông số bắt buộc: ${field}!`
                };
            }
        }

        const createdProduct = await db.Product.create({
            userId: data.userId,
            title: data.title,
            provinces: data.provinces,
            districts: data.districts,
            price: data.price,
            categoryId: data.categoryId,
            guests: data.guests,
            bedrooms: data.bedrooms,
            beds: data.beds,
            bathrooms: data.bathrooms,
            checkIn: data.checkIn,
            checkOut: data.checkOut,
            description: data.description,
            status: 'S1'
        });

        // Check if the product was created successfully
        if (!createdProduct?.id) {
            return {
                status: 2,
                message: 'Tạo mới sản phẩm thất bại!'
            };
        }

        // Create the associated images
        if (data.images && data.images.length > 0) {
            await db.ImageProduct.bulkCreate(data.images.map(image => ({
                productId: createdProduct.id,
                image
            })));
        }

        // Create the associated utilities
        if (data.utilities && data.utilities.length > 0) {
            await db.UtilityProduct.bulkCreate(data.utilities.map(utilityId => ({
                productId: createdProduct.id,
                utilityId
            })));
        }

        return {
            status: 0,
            message: 'Tạo mới thành công!'
        };

    } catch (error) {
        console.error('Tạo mới thất bại:', error);
        throw new Error('Tạo mới thất bại!');
    }
};

const getAllProductService = async (userId, categoryId, address, pageNumber) => {
    const pageSize = 20;

    try {
        let allProduct = [];

        if (pageNumber) {
            allProduct = await db.Product.findAll({
                where: {
                    userId: {
                        [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT id FROM Users WHERE status = 'S2')`)
                    },
                    status: 'S1'
                },
                attributes: ['title', 'price', 'status', 'districts'],
                include: [
                    {
                        model: db.ImageProduct,
                        as: 'imageProductData',
                        attributes: ['image'],
                        limit: 1
                    },
                    {
                        model: db.User,
                        as: 'userProductData',
                        attributes: ['name'],
                    }
                ],
                raw: false,
                nest: true
            });

            let filteredProduct = allProduct;

            const sortedProduct = filteredProduct.sort((a, b) => {
                if (a.status === 'S2' && b.status !== 'S2') {
                    return 1;
                }
                if (a.status !== 'S2' && b.status === 'S2') {
                    return -1;
                }
                return 0;
            });

            const offset = (pageNumber - 1) * pageSize;
            const paginatedProduct = sortedProduct.slice(offset, offset + pageSize);

            const totalCount = sortedProduct.length;

            const data = {
                product: paginatedProduct,
                totalCount: totalCount
            };

            return {
                status: 0,
                data: data
            };
        }

        if (userId) {
            const user = await db.User.findOne({
                where: { id: userId },
                attributes: ['status']
            });

            if (user && user.status === 'S2') {
                return {
                    status: 0,
                    data: allProduct
                };
            }

            allProduct = await db.Product.findAll({
                where: { userId: userId, status: 'S1' },
                attributes: ['title', 'status'],
                include: [
                    {
                        model: db.ImageProduct,
                        as: 'imageProductData',
                        attributes: ['image'],
                        limit: 1
                    },
                ],
                raw: false,
                nest: true
            });

        } else {
            allProduct = await db.Product.findAll({
                where: {
                    userId: {
                        [db.Sequelize.Op.notIn]: db.Sequelize.literal(`(SELECT id FROM Users WHERE status = 'S2')`)
                    },
                    status: 'S1'
                },
                attributes: ['title', 'price', 'status', 'districts'],
                include: [
                    {
                        model: db.ImageProduct,
                        as: 'imageProductData',
                        attributes: ['image'],
                        limit: 1
                    },
                    {
                        model: db.User,
                        as: 'userProductData',
                        attributes: ['name'],
                    }
                ],
                raw: false,
                nest: true
            });
        }

        if (categoryId) {
            allProduct = await db.Product.findAll({
                where: { categoryId: categoryId, status: 'S1' },
                attributes: ['title', 'price', 'status'],
                include: [
                    {
                        model: db.ImageProduct,
                        as: 'imageProductData',
                        attributes: ['image'],
                        limit: 1
                    },
                    {
                        model: db.User,
                        as: 'userProductData',
                        attributes: ['name'],
                    }
                ],
                raw: false,
                nest: true
            });
        }

        if (address) {
            allProduct = await db.Product.findAll({
                where: {
                    provinces: {
                        [db.Sequelize.Op.like]: `%${address}%`
                    },
                    status: 'S1'
                },
                attributes: ['title', 'price', 'status'],
                include: [
                    {
                        model: db.ImageProduct,
                        as: 'imageProductData',
                        attributes: ['image'],
                        limit: 1
                    },
                    {
                        model: db.User,
                        as: 'userProductData',
                        attributes: ['name'],
                    }
                ],
                raw: false,
                nest: true
            });
        }

        return {
            status: 0,
            data: allProduct
        };
    } catch (error) {
        console.error('Error fetching allProduct:', error);
        throw new Error('Error fetching allProduct');
    }
};

const getProductByIdService = async (productId) => {
    try {
        const product = await db.Product.findOne({
            where: { id: productId },
            include: [
                {
                    model: db.ImageProduct, as: 'imageProductData',
                    attributes: ['image'],
                },
                {
                    model: db.UtilityProduct, as: 'utilityProductData',
                    attributes: ['utilityId'],
                },
                {
                    model: db.User,
                    as: 'userProductData',
                    attributes: ['name'],
                }
            ],
            raw: false,
            nest: true
        });

        if (!product) {
            return {
                status: 1,
                message: 'Không tìm thấy dịch vụ!'
            };
        }

        return {
            status: 0,
            data: product
        };
    } catch (error) {
        throw new Error('Error fetching product by ID');
    }
};

const updateProductService = async (data) => {

    try {
        const product = await db.Product.findOne({
            where: { id: data.id },
            raw: false
        });

        if (!product) {
            return {
                status: 1,
                message: 'Dịch vụ không tồn tại!'
            };
        }

        product.title = data.title;
        product.provinces = data.provinces;
        product.districts = data.districts;
        product.price = data.price;
        product.categoryId = data.categoryId;
        product.guests = data.guests;
        product.bedrooms = data.bedrooms;
        product.beds = data.beds;
        product.bathrooms = data.bathrooms;
        product.checkIn = data.checkIn;
        product.checkOut = data.checkOut;
        product.description = data.description;
        product.status = data.status;

        if (data.images) {
            await db.ImageProduct.destroy({ where: { productId: data.id } });

            await db.ImageProduct.bulkCreate(data.images.map(image => ({
                productId: data.id,
                image
            })));
        }

        if (data.utilities) {

            await db.UtilityProduct.destroy({ where: { productId: data.id } });

            await db.UtilityProduct.bulkCreate(data.utilities.map(utilityId => ({
                productId: data.id,
                utilityId
            })));
        }


        await product.save();

        return {
            status: 0,
            message: 'Cập nhật thành công!'
        };

    } catch (error) {
        console.error('Cập nhật thất bại:', error);
        throw new Error('Cập nhật thất bại!');
    }
};

const deleteProductService = async (productId) => {
    try {

        const product = await db.Product.findOne({
            where: { id: productId }
        })

        if (!product) {
            return {
                status: 1,
                message: 'Không tìm thấy dịch vụ!'
            };
        }

        await db.Product.destroy({ where: { id: productId } });
        await db.ImageProduct.destroy({ where: { productId: productId } });
        await db.UtilityProduct.destroy({ where: { productId: productId } });

        return {
            status: 0,
            message: 'Xóa thành công!'
        };

    } catch (error) {
        throw new Error('Error fetching product by ID');
    }
};

export default {
    createNewProductService,
    getAllProductService,
    getProductByIdService,
    updateProductService,
    deleteProductService
};
