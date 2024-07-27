/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{ hostname: "res.cloudinary.com" }] //allow access to remote images from cloudinary
    }
};

export default nextConfig;
