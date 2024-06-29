import json
import requests
from os import environ
from sqlalchemy.orm.session import sessionmaker
from camunda.external_task.external_task import ExternalTask, TaskResult
from camundaworkers.model.offer import Offer
from camundaworkers.model.flight import Flight
from camundaworkers.model.offer_purchase_data import OfferPurchaseData
from camundaworkers.utils.const import EventSSEType
from camundaworkers.utils.logger import get_logger
from camundaworkers.utils.db import create_sql_engine


def send_correct_offer_code(task: ExternalTask) -> TaskResult:
    """
    Sends the confirmation that the offer code inserted is valid to the user
    :param task: the current task instance
    :return: the task result
    """
    logger = get_logger()
    logger.info("send_wrong_offer_code")

    offer_purchase_data = OfferPurchaseData.from_dict(json.loads(task.get_variable("offer_purchase_data")))

    # Creating a session for PostgreSQL
    Session = sessionmaker(bind=create_sql_engine())
    session = Session()

    # Gets the offer and the flight
    offer = session.query(Offer).filter(Offer.activation_code == offer_purchase_data.offer_code).one()
    flight = session.query(Flight).filter(Flight.flight_code == offer.flight_code).one()

    # Notifies the user that the code is valid and notify it sending the flight infos
    url = f'{environ.get("ACMESKY_SSE_URL", "http://acmesky_sse:3000")}/send/{EventSSEType.FLIGHT_INFOS}'
    body = {'userId': offer_purchase_data.user_id, 'message': 'Offer code is valid', 'flight': flight.to_dict()}
    requests.post(url, json=body)


    return task.complete()