const normalizeText = (value) => String(value || "").trim();

export const getCheckoutContactFromUser = (user = {}) => ({
  name: normalizeText(user.fullname || user.username),
  phone: normalizeText(user.phoneNumber),
  address: normalizeText(
    Array.isArray(user.addresses) ? user.addresses[0] : user.address
  ),
});

export const isCheckoutContactComplete = (
  contact = {},
  fulfillmentType = "delivery"
) => {
  if (!normalizeText(contact.name) || !normalizeText(contact.phone)) {
    return false;
  }

  return fulfillmentType !== "delivery" || Boolean(normalizeText(contact.address));
};
