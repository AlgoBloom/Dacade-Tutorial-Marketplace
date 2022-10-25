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

    def application_creation(self):
        return Seq([
            # expecting four app args
            Assert(Txn.application_args.length() == Int(4))
        ])