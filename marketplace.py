from pyteal import *

class Product:
    class Variables:
        name = Bytes("NAME")
        image = Bytes("IMAGE")
        description = Bytes("DESCRIPTION")
        price = Bytes("PRICE")
        sold = Bytes("SOLD")

    class AppMethods:
        buy = Bytes("buy")