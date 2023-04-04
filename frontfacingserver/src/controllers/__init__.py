from flask import Blueprint

index_mod = Blueprint("index", __name__, url_prefix="/index")
contract_mod = Blueprint(
    "contract_controller", __name__, url_prefix="/contract"
)
contract_group_mod = Blueprint(
    "contract_group_controller", __name__, url_prefix="/contractGroup"
)
nurse_mod = Blueprint("nurse_controller", __name__, url_prefix="/nurse")
nurse_group_mod = Blueprint(
    "nurse_group_controller", __name__, url_prefix="/nurseGroup"
)
profile_mod = Blueprint("profile_controller", __name__, url_prefix="/profile")
schedule_mod = Blueprint(
    "schedule_controller", __name__, url_prefix="/schedule"
)
shift_mod = Blueprint("shift_controller", __name__, url_prefix="/shift")
shift_group_mod = Blueprint(
    "shift_group_controller", __name__, url_prefix="/shiftGroup"
)
shift_type_mod = Blueprint(
    "shift_type_controller", __name__, url_prefix="/shiftType"
)
skill_mod = Blueprint("skill_controller", __name__, url_prefix="/skill")
user_mod = Blueprint("user_controller", __name__, url_prefix="/user")

from . import (
    index,
    test_socket,
    nurse_controller,
    nurse_group_controller,
    contract_controller,
    contract_group_controller,
    shift_controller,
    shift_group_controller,
    shift_type_controller,
    profile_controller,
    user_controller,
    skill_controller,
    schedule_controller,
    socket_actions,
)
