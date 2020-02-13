import { Op } from 'sequelize';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class TaskController {

  async list(req, res){
    const deliveriesByDeliveryman = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        canceled_at: null,
        end_date: null
      }
    });

    return res.json(deliveriesByDeliveryman);
  }

  async listEnded(req, res) {
    const deliveriesByDeliveryman = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: {
          [Op.not]: null
        }
      }
    });

    return res.json(deliveriesByDeliveryman);
  }

  async takePackage(req, res) {
    const { id } = req.params; // Delivery id;

    const delivery = await Delivery.findOne({
      where: {
        id
      }
    })

    if(!delivery){
      return res.status(401).json({error: 'delivery not found'})
    }

    const today = format(
      new Date(), 'yyyy-MM-dd'
    );
    const totalRetrievesToday = await Delivery.count({where: { id, start_date: today }})

    console.log(totalRetrievesToday);

    return res.json()
    const hour = format(
      new Date(), 'H', { locale: pt }
    );

    if(hour < 8 || hour > 18){
      return res.status(401).json({error: 'The products must be taken by 8am to 18pm'});
    }

    await delivery.update({
      start_date: new Date()
    })

    return res.json(delivery);
  }
}

export default new TaskController();
