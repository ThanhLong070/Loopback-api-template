import { HttpContext, PersistedModelStatic } from '../helpers/loopback';
import { Example, Transaction } from '../../codegen/api/fetch/api';

// For In-app-purchase
import { iap } from '../helpers/iap';
iap.setup();


module.exports = function(Example: PersistedModelStatic<Example>) {
    Example.beforeRemote('**', async (ctx) => {
        console.log('Report', ctx.methodString);
    });


    Example.prototype.buyIap = async function (ctx: HttpContext<Example>, data: Transaction) {

        // Receipt validation
        const transaction: Transaction = {
            appleReceipt: data.appleReceipt,
            googleReceipt: data.googleReceipt
        };

        let receipt = transaction.appleReceipt || ((transaction.googleReceipt || {}) as any).toJSON();
        if (transaction.googleReceipt) {
            receipt = { ...receipt, data: JSON.stringify(receipt.data) }
        }

        try {
            const validatedData = await iap.validate(receipt);
            if (validatedData.status !== 0) {
                return [false, 'The transactionId is incorrect'];
            }
        } catch (error) {
            return [false, error.message];
        }


        return [true, ''];
    }
};
