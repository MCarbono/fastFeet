import DeliveryProblems from '../models/DeliveryProblems';
import Delivery from '../models/Delivery';

class DeliveryProblemsController {
  async store(req, res) {
    const { id } = req.params;
    const delivery_problems = await DeliveryProblems.create({
      delivery_id: id,
      description: req.body.description
    });

    return res.json(delivery_problems);
  }

  async list(req, res){
    const delivery = await Delivery.findAll({
        includes: [
          { model: DeliveryProblems, as: 'delivery_problems' },

        ],


    });


    return res.json(delivery)
  }
}

export default new DeliveryProblemsController();
