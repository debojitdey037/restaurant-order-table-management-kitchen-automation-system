const Order = require('../models/Order');

const getDashboardStats = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const todayOrdersCount = await Order.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        const todayRevenueData = await Order.aggregate([
            {
                $match: {
                    status: 'Paid',
                    createdAt: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$grandTotal' }
                }
            }
        ]);

        let todayRevenue = 0;

        if (todayRevenueData.length > 0) {
            todayRevenue = todayRevenueData[0].total;
        }

        const topItems = await Order.aggregate([
            {
                $match: {
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $group: {
                    _id: '$items.menuItem',
                    name: { $first: '$items.name' },
                    totalSold: { $sum: '$items.quantity' },
                    totalRevenue: {
                        $sum: {
                            $multiply: ['$items.price', '$items.quantity']
                        }
                    }
                }
            },
            {
                $sort: { totalSold: -1 }
            },
            {
                $limit: 5
            }
        ]);

        const categorySales = await Order.aggregate([
            {
                $match: {
                    status: { $ne: 'Cancelled' }
                }
            },
            {
                $unwind: '$items'
            },
            {
                $lookup: {
                    from: 'menuitems',
                    localField: 'items.menuItem',
                    foreignField: '_id',
                    as: 'itemDetails'
                }
            },
            {
                $unwind: '$itemDetails'
            },
            {
                $group: {
                    _id: '$itemDetails.category',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalSales: {
                        $sum: {
                            $multiply: ['$items.price', '$items.quantity']
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalQuantity: 1,
                    totalSales: 1
                }
            },
            {
                $sort: { totalSales: -1 }
            }
        ]);

        res.json({
            todayOrdersCount,
            todayRevenue,
            topItems,
            categorySales
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to load dashboard statistics'
        });
    }
};

module.exports = {
    getDashboardStats
};