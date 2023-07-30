import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
export const createcategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(404).send({
        success: false,
        message: "invalid name",
      });
    }
    const existingCart = await categoryModel.findOne({ name });
    if (existingCart) {
      return res.status(200).send({
        success: true,
        messgae: "Already existing",
        existingCart,
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(200).send({
      success: true,
      message: "new category created",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

export const updateController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(id , {name , slug : slugify(name)} , {new:true,})
    res.status(200).send({
        success: true,
        message : 'successfully updated',
        category
    })
  } catch (error) {
    res.status(500).send({
        success : false,
        message : 'invalide while updating',
        error
    })
  }
};

export const getAllController = async(req , res) => {
    try{
        const category = await categoryModel.find({})
        res.status(200).send({
            success:true,
            message: 'get all category',
            category
        })

    }catch(error){
        res.status(500).send({
            success:true,
            message : 'error in getting',
            error
        })
    }
}

export const getSingleController = async(req , res) => {
    try{
        const category = await categoryModel.findOne({slug : req.params.slug})
        res.status(200).send({
            success: true,
            message : 'successfully in getting cart',
            category

        })
    }catch(error){
        res.status(500).send({
            success : false,
            message : 'error in getting cart',
            error
        })
    }
}

export const deleteController = async(req , res) => {
    try{
        const { id } = req.params
        console.log(id)
        const category = await categoryModel.findByIdAndDelete(id )
        res.status(200).send({
            success: true,
            message : 'delete successe fully',
            category
        })
    }catch(error){
        res.status(500).send({
            success : false,
            message: 'error while in deleting',
            error
        })
    }
}
