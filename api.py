import enum
from typing import Annotated
from livekit.agents import llm
import logging

logger = logging.getLogger("task-performer")
logger.setLevel(logging.INFO)


class Zone(enum.Enum):
    IMPORTANT_DATES = "important_dates"
    MOM = "mom"
    TIME = "time"
    TASKS = "tasks"
    CONCLUSION = "conclusion"


class AssistantFnc(llm.FunctionContext):
    def __init__(self) -> None:
        super().__init__()

        self._meeting = {
            Zone.IMPORTANT_DATES: 21,
            Zone.MOM: 0,
            Zone.TIME: 5,
            Zone.TASKS: 5,
            Zone.CONCLUSION: 1,
        }

    @llm.ai_callable(description="get the overview the metting and highlight the important dates")
    def get_meeting(
        self, zone: Annotated[Zone, llm.TypeInfo(description="The specific task")]
    ):
        logger.info("get tasks - zone %s", zone)
        meet = self._meeting[Zone(zone)]
        return f"The tasks in the {zone} is {meet}"

    @llm.ai_callable(description="perform a specific task")
    def set_meeting(
        self,
        task: Annotated[Zone, llm.TypeInfo(description="The specific task")],
        meet: Annotated[int, llm.TypeInfo(description="The task to perform")],
    ):
        logger.info("set temo - zone %s, meet: %s", task, meet)
        self._meeting[Zone(task)] = meet
        return f"The actions in the {task} is now {meet}"