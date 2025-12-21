import Order from "../models/Order.model.js"; 
let orders = [];

export const GetAll = async () => {
  try {
    const orders = await Order.find();

    return {
      error: false,
      message: "Commandes récupérés avec succès.",
      data: orders || [],
      statusCode: 200,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};

export const GetById = async (id) => {
  try {
    const order = await Order.findById(id);

    return {
      error: order ? false : true,
      message: order
        ? "la commande a été récupéré avec succès."
        : "la commande est introuvable.",
      data: order || null,
      statusCode: order ? 200 : 404,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};

export const GetByClient = async (id) => { // order =>  {order.clientId === id}

  try {
    
    const allOrders = await Order.find();
    const length = allOrders.length;
    const orders = [];
    const id_1 = id+"";
    for (let i = 0; i < length; i++) {
      const id_2 = allOrders[i].clientId+"";
      if (id_1 === id_2) {
        orders.push(allOrders[i]);
      }else{console.log(id+"" === allOrders[i].clientId+"")
        
      }
    }
    

    return {
      error: false,
      message: "Les commandes ont été récupérés avec succès.",
      data: orders || [],
      statusCode: 200,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};



export const Create = async (data) => {
  try {
    const { clientId, productArray} = data;

    const newOrderData = {
      clientId, 
      productArray

    };

    const newOrder = new Order(newOrderData);
    await newOrder.save();

    return {
      error: false,
      message: "La commande a été créé avec succès.",
      data: newOrderData,
      statusCode: 201,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};

export const Update = async (id, data) => {
  try {
    const { status } = data;

    const order = await Order.findById(id);

    if (!order) {
      return {
        error: true,
        message: "La commande n'existe pas.",
        statusCode: 404,
      };
    }

    const updatedOrderData = {
      status: status ?? order.status,
    };

    const updatedOrder = await Order.findByIdAndUpdate(id, updatedOrderData, { new: true });

    return {
      error: false,
      message: "Le status de la commandes a été mis à jour avec succès.",
      data: updatedOrder,
      statusCode: 200,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};

export const Delete = async (id) => {
  try {
    const order = await Order.findById(id);

    if (!order) {
      return {
        error: true,
        message: "Le commande n'existe pas.",
        statusCode: 404,
      };
    }

    await Order.findByIdAndDelete(id);

    return {
      error: false,
      message: "La commande a été supprimé avec succès.",
      statusCode: 200,
    };
  } catch (error) {
    return {
      error: true,
      message: error,
      statusCode: 500,
    };
  }
};

export default {
  GetById,
  GetByClient,
  GetAll,
  Create,
  Update,
  Delete
}