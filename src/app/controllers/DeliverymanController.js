import * as yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      avatar_id: yup.number(),
      email: yup
        .string()
        .email()
        .required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.json(400).json({ error: 'validation fails' });
    }

    const userEmail = await Deliveryman.findOne({
      where: { email: req.body.email }
    });

    if (userEmail) {
      return res.status(400).json({ error: 'email already registered' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async show(req, res) {
    const { id } = req.params;
    const deliveryman = await Deliveryman.findOne({
      where: { id },
      include: [
        {
          model: File,
          as: 'avatar'
        }
      ]
    });

    return res.json(deliveryman);
  }

  async list(req, res) {
    const deliverymen = await Deliveryman.findAll();

    return res.json(deliverymen);
  }

  async destroy(req, res) {
    const { id } = req.params;

    await Deliveryman.destroy({ where: { id } });

    res.status(200).json({ success: 'Deliveryman deleted with success' });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string().matches(/[A-Za-z]{3,}/),
      avatar_id: yup.number().integer(),
      email: yup.string().email()
    })

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'validation fails' });
    }

    const { id } = req.params;

    const { name, avatar_id, email } = req.body;

    const deliveryman = await Deliveryman.findByPk(id);

    await deliveryman.update({
      name,
      avatar_id,
      email
    });

    return res.json({
      message: 'Deliveryman updated with success',
      name,
      avatar_id,
      email
    });
  }
}

export default new DeliverymanController();
