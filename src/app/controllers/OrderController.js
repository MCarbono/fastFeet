import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class OrderController {

  async show(req, res){
    const { id } = req.params;

    const order = await Order.findOne({where:
      {
       id
      },
      include: [
        {model: Recipient, as: 'recipient'}
      ]
    });

    return res.json(order);
  }

  async store(req, res) {

    const order = await Order.create(req.body);

    return res.json(order);
  }
}

export default new OrderController();
