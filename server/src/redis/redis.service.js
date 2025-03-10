import redis from 'redis';
import { promisify } from 'util';

import inventoriesRepo from '../models/repositories/inventories.repo.js';

// Tạo Redis client
const redisClient = redis.createClient();

// Promisify các phương thức Redis
const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);
const deleteAsync = promisify(redisClient.del).bind(redisClient);

// Xử lý lỗi kết nối Redis
redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

/**
 * Hàm acquireLock: Tạo khóa để đảm bảo tính toàn vẹn dữ liệu khi đặt trước kho hàng.
 * @param {string} productId - ID của sản phẩm.
 * @param {number} quantity - Số lượng sản phẩm cần đặt trước.
 * @param {string} cartId - ID của giỏ hàng.
 * @returns {string|null} - Khóa nếu thành công, ngược lại trả về null.
 */
const acquireLock = async ({ productId, quantity, cartId }) => {
    const key = `lock_v2023_${productId}`;
    const retryTime = 10; // Số lần thử
    const expireTime = 3000; // Thời gian hết hạn của khóa (3 giây)

    for (let i = 0; i < retryTime; i++) {
        try {
            // Thử đặt khóa
            const result = await setnxAsync(key, expireTime);

            if (result === 1) {
                // Đặt khóa thành công, thực hiện đặt trước kho hàng
                const isReservation = await inventoriesRepo.reservationInventory({
                    productId,
                    quantity,
                    cartId,
                });

                if (isReservation.modifiedCount) {
                    // Đặt thời gian hết hạn cho khóa
                    await pexpire(key, expireTime);
                    return key; // Trả về khóa
                }

                // Nếu đặt trước thất bại, xóa khóa
                await deleteAsync(key);
                return null;
            }

            // Nếu không đặt được khóa, đợi 50ms trước khi thử lại
            await new Promise((resolve) => setTimeout(resolve, 50));
        } catch (err) {
            console.error('Error acquiring lock:', err);
            return null;
        }
    }

    return null; // Trả về null nếu không đặt được khóa sau số lần thử
};

/**
 * Hàm releaseLock: Giải phóng khóa.
 * @param {string} key - Khóa cần giải phóng.
 */
const releaseLock = async (key) => {
    try {
        await deleteAsync(key);
        console.log(`Lock released: ${key}`);
    } catch (err) {
        console.error('Error releasing lock:', err);
    }
};



export default {
    acquireLock,
    releaseLock,
};