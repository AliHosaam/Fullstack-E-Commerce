const express = require("express");
const cloudinary = require("../utils/cloudinary");
const Product = require("../Models/product");

const router = express.Router();

// Creates a Product
router.post("/", async (req, res) => {
  const { name, brand, des, price, image } = req.body;

  try {
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        upload_preset: "online-shop",
      });

      if (uploadRes) {
        const product = new Product({
          name,
          brand,
          des,
          price,
          image: uploadRes,
        });

        const savedProduct = await product.save();

        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Gets All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).send(products);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

// Gets a Product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Edit a Product
router.put("/:id", async (req, res) => {
  if (req.body.productImage) {
    try {
      const destroyResponse = await cloudinary.uploader.destroy(
        req.body.product.image.public_id
      );

      if (destroyResponse) {
        const uploadResponse = await cloudinary.uploader.upload(
          req.body.productImage,
          {
            upload_preset: "online-shop",
          }
        );

        if (uploadResponse) {
          const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                ...req.body.product,
                image: uploadResponse,
              },
            },
            { new: true }
          );

          res.status(200).send(updatedProduct);
        }
      }
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (error) {
      res.status(500).send(error);
    }
  }
});

// Delete a Product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );

      if (destroyResponse) {
        const deleteProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deleteProduct);
      }
    } else {
      console.log("Action terminated. Failed to delete product image...");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
