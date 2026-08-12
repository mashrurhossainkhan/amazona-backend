//import bcrypt from 'bcryptjs';
const bcrypt = require('bcryptjs');
const data = {
    users: [
        {
          name: 'Mashrur',
          email: 'admin@example.com',
          password: bcrypt.hashSync('1234', 8),
          isAdmin: true,
          isSeller: true,
        seller: {
            name: 'Puma',
            logo: '/images/logo1.png',
            description: 'best seller',
            rating: 4.5,
            numReviews: 120,
        },
        },
        {
          name: 'Abu Bakar',
          email: 'user@example.com',
          password: bcrypt.hashSync('1234', 8),
          isAdmin: false,
        },
      ],
    products: [
        {
            
            name: "Nike slip Shirt",
            category: "shirts",
            image: 'images/p1.jpg',
            price: 120,
            brand: "Nike",
            rating: 4.5,
            numReviews: 10,
            countInStock: 10,
            description: 'high quality product'
        },
        {
            
            name: "Adidas slip Shirt",
            category: "shirts",
            image: 'images/p2.jpg',
            price: 100,
            brand: "Adidas",
            rating: 4.5,
            numReviews: 10,
            countInStock: 10,
            description: 'high quality product'
        },
        {
          
            name: "Lacosta slip Shirt",
            category: "shirts",
            image: 'images/p1.jpg',
            price: 120,
            brand: "Lacosta",
            rating: 4,
            countInStock: 10,
            numReviews: 17,
            description: 'high quality product'
        },
        {
           
            name: "Nike slip pant1",
            category: "pant",
            image: 'images/p4.jpg',
            price: 138,
            brand: "Nike",
            countInStock: 0,
            rating: 4.5,
            numReviews: 17,
            description: 'high quality product'
        },
        {
          
            name: "pant5",
            category: "Pant",
            image: 'images/p2.jpg',
            price: 120,
            brand: "Puma",
            rating: 4.5,
            numReviews: 10,
            countInStock: 3,
            description: 'high quality product'
        },

        {
            
            name: "Puma slip Pant1",
            category: "Pant",
            image: 'images/p3.jpg',
            price: 120,
            brand: "Puma",
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            
            name: "Puma slip Pant2",
            category: "Pant",
            image: 'images/p3.jpg',
            price: 120,
            brand: "Puma",
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'high quality product'
        },
        {
            
            name: "Puma slip Pant3",
            category: "Pant",
            image: 'images/p3.jpg',
            price: 120,
            brand: "Puma",
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'high quality product'
        },
        {
           
            name: "Puma slip Pant4",
            category: "Pant",
            image: 'images/p3.jpg',
            price: 120,
            brand: "Puma",
            rating: 4.5,
            countInStock: 10,
            numReviews: 10,
            description: 'high quality product'
        },
    ]
};

module.exports = data;