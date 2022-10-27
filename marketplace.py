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
            Assert(Txn.note() == Bytes("marketplace:uv1")),
            # requires the price is greater than zero
            Assert(Btoi(Txn.application_args[3]) > Int(0)),
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
            # sender of payment txn must match sender of smart contract call
            Gtxn[1].sender() == Gtxn[0].sender(),
        )

        # can buy checks that there is a valiud number of txns and that the checks in valid payment to seller and subroutine pass
        can_buy = And(valid_number_of_transactions,
                      valid_payment_to_seller)

        # updates the global state
        update_state = Seq([
            App.globalPut(
                # accessing the sold key
                self.Variables.sold,
                # putting current sold value plus purchase count
                App.globalGet(self.Variables.sold) + Btoi(count)),
                # exits the seq with an approval
                Approve()
        ])

        # return actual executes something, if can buy passes then the update state will run, else the reject will run and buy function will exit
        return If(can_buy).Then(update_state).Else(Reject())

    # application deletion function, self passes in the variables and app methods
    def application_deletion(self):
        # checks that txn sender is sc creator before deleting
        return Return(Txn.sender() == Global.creator_address())

    # on application start we check conditions to see what we do
    def application_start(self):
        return Cond(
            # if the app doesn't exist then create it
            [Txn.application_id() == Int(0), self.application_creation],
            # check if the txn is a delete app type, if so delete app
            [Txn.on_completion() == OnComplete.DeleteApplication, self.application_deletion()],
            # if the first app arg is the buy method, run buy function
            [Txn.application_args[0] == self.AppMethods.buy, self.buy()]
            # otherwise the transaction is rejected
        )

    # approval program ran by AVM
    def approval_program(self):
        # returns the application start conditional statement
        return self.application_start()

    # clear program ran by AVM to remove from user accts
    def clear_program(self):
        # approves the clear
        return Return(Int(1))

    