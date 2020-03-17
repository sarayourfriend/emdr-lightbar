import random
import string


def new_session_id():
    letters = string.ascii_uppercase
    numbers = string.digits

    first_three = ''.join(random.choice(letters) for _ in range(3))
    last_three = ''.join(random.choice(numbers) for _ in range(3))
    return f'{first_three}-{last_three}'
