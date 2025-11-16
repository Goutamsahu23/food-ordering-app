import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { RestaurantsService } from './restaurants/restaurants.service';
import * as dotenv from 'dotenv';
import { PaymentsService } from './payments/payments.service';

async function run() {
  dotenv.config();
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const usersService = appContext.get(UsersService);
  const restaurantsService = appContext.get(RestaurantsService);

  const seedUsers = [
    // { email: 'nick@shield.com', passwordHash: 'nickpass', role: 'admin', country: 'India' },
    // { email: 'captain.marvel@shield.com', passwordHash: 'capmarvel', role: 'manager', country: 'India' },
    // { email: 'captain.america@shield.com', passwordHash: 'capamerica', role: 'manager', country: 'America' },
    // { email: 'thanos@shield.com', passwordHash: 'thanos', role: 'member', country: 'India' },
    // { email: 'thor@shield.com', passwordHash: 'thor', role: 'member', country: 'India' },
    // { email: 'travis@shield.com', passwordHash: 'travis', role: 'member', country: 'America' },


    { email: 'nick.admin@shield.com', passwordHash: 'password', role: 'admin', country: 'India' },
    { email: 'captain.marvel.manager.ind@shield.com', passwordHash: 'password', role: 'manager', country: 'India' },
    { email: 'captain.america.manager.uk@shield.com', passwordHash: 'password', role: 'manager', country: 'America' },
    { email: 'thanos.ind@shield.com', passwordHash: 'password', role: 'member', country: 'India' },
    { email: 'thor.ind@shield.com', passwordHash: 'password', role: 'member', country: 'India' },
    { email: 'travis.uk@shield.com', passwordHash: 'password', role: 'member', country: 'America' },
  ];

  for (const u of seedUsers) {
    const exists = await usersService.findByEmail(u.email);
    if (!exists) {
      await usersService.create({ email: u.email, passwordHash: u.passwordHash, role: u.role as any, country: u.country });
      console.log('Seeded user', u.email);
    } else {
      console.log('User exists', u.email);
    }
  }

  // Seed restaurants + menu items
  const restaurantsToSeed = [
    {
      name: 'The Spice House',
      address: 'Connaught Place',
      country: 'India',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=7c5a9b9b1b2a6a1f3b5c3d9e5d2f4a2a',
      menu: [
        { name: 'Butter Chicken', price: 8.99, imageUrl: 'https://images.unsplash.com/photo-1604908177522-6d1570d9b2a9?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abc' },
        { name: 'Paneer Tikka', price: 6.5, imageUrl: null },
      ],
    },
    {
      name: 'Green Garden',
      address: 'Bandra',
      country: 'India',
      imageUrl: null, // will fall back to frontend static image
      menu: [
        { name: 'Caesar Salad', price: 5.5, imageUrl: 'https://images.unsplash.com/photo-1543353071-087092ec393a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=def' },
        { name: 'Veg Wrap', price: 4.0 },
      ],
    },
    {
      name: 'Americano Diner',
      address: 'Manhattan',
      country: 'America',
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=ghi",
      menu: [
        { name: 'Cheeseburger', price: 9.5, imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=jkl' },
        { name: 'Fries', price: 3.0 },
      ],
    },
    {
      name: 'Bombay Chaat Corner',
      address: 'Colaba Causeway',
      country: 'India',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=zxc',
      menu: [
        { name: 'Pani Puri', price: 3.5, imageUrl: 'https://images.unsplash.com/photo-1519864600265-c3cac22b3528?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=pani' },
        { name: 'Sev Puri', price: 2.99, imageUrl: null },
        { name: 'Samosa', price: 2.25, imageUrl: 'https://images.unsplash.com/photo-1523987355523-c7b5b8c58fcd?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=samo' }
      ],
    },
    {
      name: 'Brooklyn Pizza',
      address: 'Brooklyn',
      country: 'America',
      imageUrl: 'https://images.unsplash.com/photo-1603079841974-f89d15a23741?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=brook',
      menu: [
        { name: 'Pepperoni Pizza', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=pep' },
        { name: 'Veggie Pizza', price: 11.49, imageUrl: null },
        { name: 'Garlic Bread', price: 4.5 }
      ],
    },
    {
      name: 'Tokyo Sushi Bar',
      address: 'Downtown',
      country: 'America',
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=sushi',
      menu: [
        { name: 'California Roll', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=cal' },
        { name: 'Tuna Nigiri', price: 8.5, imageUrl: null },
        { name: 'Miso Soup', price: 3.0 }
      ]
    }
  ];


  for (const r of restaurantsToSeed) {
    // check by name + country
    try {
      // naive find by name & country
      const found = (await restaurantsService.findAllForUser({ role: 'admin' })) as any[];
      const exists = found.find(fr => fr.name === r.name && fr.country === r.country);
      if (!exists) {
        const rest = await restaurantsService.createRestaurant({ name: r.name, address: r.address, country: r.country, imageUrl: r.imageUrl });
        console.log('Seeded restaurant', rest.name);
        for (const m of r.menu) {
          await restaurantsService.addMenuItem({ role: 'admin', country: r.country }, rest.id, m);
          console.log('  -> seeded menu item', m.name);
        }
      } else {
        console.log('Restaurant exists', r.name);
      }
    } catch (err) {
      console.error('Error seeding restaurant', r.name, err);
    }
  }

  await appContext.close();
  console.log('Seeding complete.');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
