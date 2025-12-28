import { pool } from '../config/database';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedUsers = async () => {
    try {
        console.log('Starting to seed default users...');

        // Hash passwords
        const adminPassword = await bcrypt.hash('admin123', 10);
        const helperPassword = await bcrypt.hash('helper123', 10);
        const residentPassword = await bcrypt.hash('resident123', 10);

        const defaultUsers = [
            {
                name: 'Admin User',
                email: 'admin@neighbourhood.com',
                password: adminPassword,
                contact_info: '+1-555-0001',
                location: 'Admin Office, Downtown',
                role: 'Admin'
            },
            {
                name: 'John Helper',
                email: 'helper@neighbourhood.com',
                password: helperPassword,
                contact_info: '+1-555-0002',
                location: '123 Helper Street, Northside',
                role: 'Helper'
            },
            {
                name: 'Jane Resident',
                email: 'resident@neighbourhood.com',
                password: residentPassword,
                contact_info: '+1-555-0003',
                location: '456 Resident Avenue, Southside',
                role: 'Resident'
            }
        ];

        // Check if users already exist
        for (const user of defaultUsers) {
            const [existing]: any = await pool.query(
                'SELECT id FROM Users WHERE email = ?',
                [user.email]
            );

            if (existing.length > 0) {
                console.log(`User ${user.email} already exists. Skipping...`);
                continue;
            }

            await pool.query(
                `INSERT INTO Users (name, email, password, contact_info, location, role) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [user.name, user.email, user.password, user.contact_info, user.location, user.role]
            );

            console.log(`✅ Created user: ${user.email} (${user.role})`);
        }

        console.log('\n🎉 Default users seeded successfully!');
        console.log('\n📝 Login Credentials:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Admin:');
        console.log('  Email: admin@neighbourhood.com');
        console.log('  Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Helper:');
        console.log('  Email: helper@neighbourhood.com');
        console.log('  Password: helper123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Resident:');
        console.log('  Email: resident@neighbourhood.com');
        console.log('  Password: resident123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();
