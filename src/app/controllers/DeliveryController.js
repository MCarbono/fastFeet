import * as yup from 'yup';
import Delivery from '../models/Delivery';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';

import Mail from '../../lib/Mail';

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

    const schema = yup.object().shape({
      recipient_id: yup.number().integer().required(),
      deliveryman_id: yup.number().integer().required(),
      product: yup.string().required()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'validation fails' });
    }

    const { recipient_id, deliveryman_id, product } = req.body;

    const deliveryman = await Deliveryman.findByPk(deliveryman_id);
    const recipient = await Recipient.findByPk(recipient_id);

    if(!deliveryman){
      return res.status(400).json({ error: 'deliveryman not found '});
    }

    if(!recipient){
      return res.status(400).json({ error: 'Recipient not found '});
    }

    const delivery = await Delivery.create({
      recipient_id,
      deliveryman_id,
      product
    });

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Entrega cadastrada',
      text: `${deliveryman.name}, você tem uma encomenda pronta para retirada.`
    });

    return res.json(delivery);

  }

  async update(req, res) {

    const schema = yup.object().shape({
      recipient_id: yup.number().integer(),
      deliveryman_id: yup.number().integer(),
      product: yup.string()
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'validation fails' })
    }

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

  async destroy(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);

    if(!delivery){
      return res.status(401).json({ error: 'delivery not found' });
    };

    await delivery.destroy();

    return res.json({ message: 'delivery deleted with success.' });
  }


}

export default new DeliveryController();
