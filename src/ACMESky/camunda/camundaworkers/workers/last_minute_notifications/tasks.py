from camundaworkers.workers.last_minute_notifications.save_flights import save_flights
from camundaworkers.workers.last_minute_notifications.retrieve_user_interests import retrieve_user_interests
from camundaworkers.workers.last_minute_notifications.check_offers_presence import check_offers_presence
from camundaworkers.workers.last_minute_notifications.notify_user_via_prontogram import notify_user_via_prontogram

TASKS = [
    ("save-flights", save_flights),
    ("retrieve-user-interests", retrieve_user_interests),
    ("check-offers-presence", check_offers_presence),
    ("notify-user-via-prontogram", notify_user_via_prontogram)
]
