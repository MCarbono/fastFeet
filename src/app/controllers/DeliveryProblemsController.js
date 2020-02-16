import { Op } from 'sequelize';
import DeliveryProblems from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async store(req, res) {
    const { id } = req.params;

    const deliveryExists = await Delivery.findByPk(id);

    if (!deliveryExists) {
      return res.status(401).json({ error: 'Delivery does not exists.' });
    }

    const orderRetrieved = await Delivery.findOne({
      where: {
        id,
        start_date: {
          [Op.not]: null
        }
      }
    });

    if (!orderRetrieved) {
      return res.status(401).json({
        error:
          'You cannot register a problem for a product that was not been taken'
      });
    }
    const delivery_problems = await DeliveryProblems.create({
      delivery_id: id,
      description: req.body.description
    });

    return res.json(delivery_problems);
  }

  async list(req, res) {
    const delivery = await DeliveryProblems.findAll({
      attributes: ['id', 'description', 'created_at'],
      include: [
        { model: Delivery, as: 'delivery', attributes: ['id', 'product'] }
      ]
    });

    return res.json(delivery);
  }

  async show(req, res) {
    const { id } = req.params;
    const deliveryProblemExists = await Delivery.findByPk(id);

    if (!deliveryProblemExists) {
      return res
        .status(401)
        .json({ error: 'Delivery Problem does not exists.' });
    }

    const problems = await DeliveryProblems.findAll({
      where: {
        delivery_id: id
      },
      attributes: ['id', 'description', 'created_at']
    });
    return res.json(problems);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const deliveryProblem = await DeliveryProblems.findByPk(id);

    if (!deliveryProblem) {
      return res
        .status(401)
        .json({ error: 'Delivery Problem does not exists.' });
    }

    const delivery = await Delivery.findOne({
      where: {
        id: deliveryProblem.delivery_id,
        canceled_at: null
      }
    });

    if (!delivery) {
      return res.status(401).json({ error: 'Delivery was calceled already' });
    }

    await delivery.update({
      canceled_at: new Date()
    });
    return res.json(delivery);
  }
}

export default new DeliveryProblemsController();
