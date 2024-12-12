const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - category
 *         - price
 *         - quantity
 *         - inventoryStatus
 *       properties:
 *         code:
 *           type: string
 *           description: The unique code of the product
 *         name:
 *           type: string
 *           description: The name of the product
 *         description:
 *           type: string
 *           description: A short description of the product
 *         image:
 *           type: string
 *           description: URL of the product image
 *         category:
 *           type: string
 *           description: The category of the product
 *         price:
 *           type: number
 *           description: The price of the product
 *         quantity:
 *           type: number
 *           description: The stock quantity of the product
 *         internalReference:
 *           type: string
 *           description: Internal reference of the product
 *         shellId:
 *           type: number
 *           description: Associated shell ID
 *         inventoryStatus:
 *           type: string
 *           enum: [INSTOCK, LOWSTOCK, OUTOFSTOCK]
 *           description: Inventory status of the product
 *         rating:
 *           type: number
 *           description: The average rating of the product
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the product
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The last update date of the product
 *       example:
 *         code: P12345
 *         name: Example Product
 *         description: A sample product
 *         image: http://example.com/image.jpg
 *         category: Electronics
 *         price: 199.99
 *         quantity: 10
 *         internalReference: REF123
 *         shellId: 1
 *         inventoryStatus: INSTOCK
 *         rating: 4.5
 *         createdAt: 2024-01-01T12:00:00Z
 *         updatedAt: 2024-01-02T12:00:00Z
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     security:
 *       - BearerAuth: []
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     security:
 *       - BearerAuth: []
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Validation error
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedProduct)
      return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct)
      return res.status(404).json({ error: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
