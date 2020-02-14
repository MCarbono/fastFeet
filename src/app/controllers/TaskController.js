import { Op } from 'sequelize';
import { format, setSeconds, setMinutes, setHours, setMilliseconds, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Delivery from '../models/Delivery';
import File from '../models/File';

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
    const  delivery_id  = req.params.idDelivery; // Delivery id;
    const  deliveryman_id  = req.params.idDeliveryman;

    const delivery = await Delivery.findOne({
      where: {
        id: delivery_id
      }
    })

    if(!delivery){
      return res.status(401).json({ error: 'delivery not found' });
    }

    /*let start_time = format(
      new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: pt }
    );
    start_time = setSeconds(parseISO(start_time), 0);
    start_time = setMinutes(start_time, 0);
    start_time = setHours(start_time, 8);
    start_time = setMilliseconds(start_time, 0);

    let end_time = format(
      new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { locale: pt }
    );

    end_time = setSeconds(parseISO(end_time), 0);
    end_time = setMinutes(end_time, 0);
    end_time = setHours(end_time, 18);
    end_time = setMilliseconds(end_time, 0);*/

    const start_time = new Date();
    start_time.setHours(8, 0, 0, 0);

    const end_time = new Date();
    end_time.setHours(18, 0, 0, 0);

    const totalRetrievesToday = await Delivery.count({
      where: {
        deliveryman_id: deliveryman_id,
        start_date: {
          [Op.gte]: start_time,
          [Op.lte]: end_time
        }
      }
      });

    if(totalRetrievesToday > 4) {
      return res.status(401).json({ error: 'you may only retrieve 5 orders a day'})
    }

    const hour = format(
      new Date(), 'H', { locale: pt }
    );

    if(hour < 8 || hour > 18){
      return res.status(401).json({ error: 'The products must be taken by 8am to 18pm' });
    }

    await delivery.update({
      start_date: new Date()
    })

    return res.json(delivery);
  }

  async deliverOrder(req, res) {
    const { id } = req.params;
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    const delivery = await Delivery.findByPk(id);

    await delivery.update({
      signature_id: file.id,
      end_date: new Date()
    });

    return res.status(200).json(delivery);
  }
}

export default new TaskController();
