import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import File from '../models/File';

class DeliveryController {

  async show(req, res){
    const { id } = req.params;

    const delivery = await Delivery.findOne({where:
      {
       id
      },
      include: [
        {model: Recipient, as: 'recipient'}
      ]
    });

    return res.json(delivery);
  }

  async store(req, res) {

    const delivery = await Delivery.create(req.body);

    return res.json(delivery);
  }

  async update(req, res){

    const { recipient_id, deliveryman_id, product } = req.body;

    const delivery = await Delivery.findByPk(req.params.id);

    if(!delivery){
      return res.status(401).json({ error: 'delivery not found' });
    };

    await delivery.update({
      recipient_id,
      deliveryman_id,
      product
    });

    return res.status(200).json({
      message: 'Delivery updated with success',
      recipient_id,
      deliveryman_id,
      product
    })
  }

  async list(req, res){
    const deliveries = await Delivery.findAll();
    return res.json(deliveries);
  }

  async destroy(req, res){

    const delivery = await Delivery.findByPk(req.params.id);

    if(!delivery){
      return res.status(401).json({ error: 'delivery not found' });
    };

    await delivery.destroy();

    return res.json({ message: 'delivery deleted with success.' });
  }
}

export default new DeliveryController();
