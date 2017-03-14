import random
import string


def randomstring(length, chars=(string.ascii_letters + string.digits)):
    sysrandom = random.SystemRandom()
    return ''.join(sysrandom.choice(chars) for i in range(length))
