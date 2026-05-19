import type {Core} from '@strapi/strapi';

const ENABLED_REMOVE_OLD_BOOKINGS = false
// false! todo:: env var
const ENABLED_SYNC = false

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {

  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap( { strapi }: { strapi: Core.Strapi }) {

    {
      // ------------------------
      // Remove old reservations
      // ------------------------

      if (ENABLED_REMOVE_OLD_BOOKINGS) {
        setTimeout(async () => {
          await strapi.service('api::book.book').checkUnpaidBooks()
        })

        // setInterval(async () => {
        //   await strapi.service('api::book.book').checkUnpaidBooks()
        // }, 15 * 60 * 1000);
      }

    }


    {
      // ------------------------
      // Sync all data
      // ------------------------

      if (ENABLED_SYNC) {
        setTimeout(async () => {
          await strapi.service('api::room.room').mainSynchronization()
        })
        // setInterval(async () => {
        //   await strapi.service('api::room.room').mainSynchronization()
        // }, OTEL_MS_TTL)
      }
    }
  },
};
