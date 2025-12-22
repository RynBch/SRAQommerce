import ordersService from "../services/orders.Service.js";


export const GetAllOrders = async (req, res) => {
  const result = await ordersService.GetAll();

  return res.status(result.statusCode).json(result);
};


export const GetOrderById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Paramètre invalide",
      statusCode: 400,
    });
  }
  const result = await ordersService.GetById(id);

  return res.status(result.statusCode).json(result);
};

export const GetOrdersByClient = async (req, res) => {

  const result = await ordersService.GetByClient(req.user._id);
  return res.status(result.statusCode).json(result);
};



export const CreateOrder = async (req, res) => {
  const productArray = req.body.productArray;
  const clientId = req.user._id;
  const result = await ordersService.Create({
    clientId,
    productArray
  });

  return res.status(result.statusCode).json(result);
};


export const UpdateOrder = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Paramètre invalide",
      statusCode: 400,
    });
  }

  const { status } = req.body;

  const result = await ordersService.Update(id, {
    status
  });

  return res.status(result.statusCode).json(result);
};

export const DeleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Paramètre invalide",
      statusCode: 400,
    });
  }

  const result = await ordersService.Delete(id);

  return res.status(result.statusCode).json(result);
};

export default {
  GetOrderById,
  GetOrdersByClient,
  GetAllOrders,
  CreateOrder,
  UpdateOrder,
  DeleteOrder
}