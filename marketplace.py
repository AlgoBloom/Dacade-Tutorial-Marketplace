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
            Assert(Txn.application_args.length() == Int(4)),
            # note must say marketplace
            Assert(Txn.note() == Bytes("marketplace")),
            # requires the price is greater than zero
            Assert(Txn.application_args[3] > Int(0)),
            # name saved as global key
            App.globalPut(Bytes("name"), Txn.application_args[0]),
            # exits sequence with approval
            Approve()
        ])