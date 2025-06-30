from datetime import datetime
import pytz

def get_sri_lanka_date():
    colombo_tz = pytz.timezone("Asia/Colombo")
    return datetime.now(colombo_tz).date()
