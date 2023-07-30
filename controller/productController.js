import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from "fs";
import categoryModel from "../models/categoryModel.js";
import orderModel from '../models/orderModel.js'
import braintree from "braintree";
import dotenv from 'dotenv';
dotenv.config();

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createproductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(500).send({
        success: false,
        message: "name is required",
      });
    }
    if (!description) {
      return res.status(500).send({
        success: false,
        message: "description is required",
      });
    }
    if (!price) {
      return res.status(500).send({
        success: false,
        message: "price is required",
      });
    }
    if (!category) {
      return res.status(500).send({
        success: false,
        message: "category is required",
      });
    }
    if (!quantity) {
      return res.status(500).send({
        success: false,
        message: "quantity is required",
      });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "photo is required and less than 1mb",
      });
    }
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "invalid to create product",
      error,
    });
  }
};

export const getallProduct = async (req, res) => {
  try {
    const product = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Get all product",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "invalid to get all product",
      error,
    });
  }
};

export const singleProduct = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate('category')
      .select("-photo");
    res.status(200).send({
      success: true,
      message: "gettin single data",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: " invalid while getting single product",
      error,
    });
  }
};

export const getPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id).select("photo");
    console.log(product.photo.contentType);
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "invalid of getting photo",
      error,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id).select("-photo");
    res.status(200).send({
      success: true,
      message: "delete product",
      product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "invalid delete operation",
      error,
    });
  }
};

export const updateController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    if (!name) {
      return res.status(500).send({
        success: false,
        message: "name is required",
      });
    }
    if (!description) {
      return res.status(500).send({
        success: false,
        message: "description is required",
      });
    }
    if (!price) {
      return res.status(500).send({
        success: false,
        message: "price is required",
      });
    }
    if (!category) {
      return res.status(500).send({
        success: false,
        message: "category is required",
      });
    }
    if (!quantity) {
      return res.status(500).send({
        success: false,
        message: "quantity is required",
      });
    }
    if (photo && photo.size > 1000000) {
      return res.status(500).send({
        success: false,
        message: "photo is required and less than 1mb",
      });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      {...req.files},
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "invalid to create product",
      error,
    });
  }
};

export const ProductFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked) args.category = checked;
    if (radio) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productModel.find(args);
    res.status(200).send({
      success: true,
      message: "product filtered successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while filtering the product",
    });
  }
};

export const productCountCountroller = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal error",
    });
  }
};

export const productPageController = async (req, res) => {
  try {
    const perpage = 3;
    const page = req.params.page ? req.params.page : 1;
    const product = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perpage)
      .limit(perpage)
      .sort({ createdAt: -1 });
      res.status(200).send({
        success : true,
        product
      })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal error",
    });
  }
};


export const searchProductController = async(req , res) => {
  try{
    const { keyword } = req.params
    const result = await productModel.find({
      $or:[
        {name: {$regex: keyword, $options: "i"}},
        {description: {$regex: keyword, $options: "i"}}
      ]
    }).select('-photo')
    res.json(result)
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message : "Error during search",
      error
    })
  }
}

export const similarProductController = async(req , res) => {
  try{
    const { cid , pid} = req.body
    const products = await productModel.find({
      category : cid,
      _id : {$ne : pid}
    }).select('-photo').limit(3)
    .populate('category')
    res.status(200).send({
      success :true,
      message : "successfully getting similar product",
      products
    })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error during Similar Product',
      error
    })
  }
}

export const productcategoryController = async(req , res) => {
  try{
  const category = await categoryModel.findOne({slug : req.params.slug})
  const products = await productModel.find({category}).populate('category')
  res.status(200).send({
    success:true,
    message : "successfully getting product by category",
    category,
    products
  })
  }catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message:'Error while getting product'
    })
  }
}

export const braintreeTokenController = async(req , res) => {
  try{
    gateway.clientToken.generate({} , function(error , response){
      if(error){
        res.status(500).send(error)
      }
      else{
        res.send(response)
      }
    })
  }catch(error){
    console.log(error)
  }
}

export const braintreePaymentController = async(req, res) => {
  try{

    const {cart , nonce} = req.body
    console.log(req.body)
    let total = 0
    cart.map((item) => {
      total += item.price
    })
    let newTransaction = gateway.transaction.sale({
      amount : total,
      paymentMethodNonce : nonce,
      options:{
        submitForSettlement : true
      }
    },
    function(error , result){
      if(result){
        const order = new orderModel({
          products : cart,
          payment : result,
          buyer : req.user.id
        }).save()
        res.json({ok : true})
      }
      else{
        res.status(500).send(error)
      }
    }
    )
  }catch(error){
    console.log(error)
  }
}