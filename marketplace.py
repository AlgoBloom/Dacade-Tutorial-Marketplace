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
            # image saved as global key
            App.globalPut(Bytes("image"), Txn.application_args[1]),
            # description saved as global key
            App.globalPut(Bytes("description"), Txn.application_args[2]),
            # price saved as global key
            App.globalPut(Bytes("price"), Btoi(Txn.application_args[3])),
            # sold saved as global key
            App.globalPut(Bytes("sold"), Int(0)),
            # exits sequence with approval
            Approve()
        ])

    # this function will be the one app method defined in the app methods class
    def buy(self):
        # expects one app arg in the txn
        count = Txn.application_args[1]
        # expects two txn
        valid_number_of_transactions = Global.group_size() == Int(2)

        # checks for a valid txn
        valid_payment_to_seller = And(
            # transaction type must be payment
            Gtxn[1].type_enum() == TxnType.Payment,
            # receiver must be the sc creator
            Gtxn[1].receiver() == Global.creator_address(),
            # amount of the payment is the price times the count
            Gtxn[1].amount() == App.globalGet(self.Variables.price) * Btoi(count),
            # sender of the payment (second txn) is the txn sender addr for the first txn
            Gtxn[1].sender() == Gtxn[0].sender(),
        )

        # can buy checks that there is a valiud number of txns and that the checks in valid payment to seller and subroutine pass
        can_buy = And(valid_number_of_transactions,
                      valid_payment_to_seller)