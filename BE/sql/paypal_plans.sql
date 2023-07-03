-- 1 days --
insert into ECOMMERCE.paypal_billing_plans(planId,tier,frequency,amount, numberProduct, numberIndex, isTrial ,created_at,updated_at)
values
('P-5G525910MD9927118MSNJZTY','starter','monthly', 3, 2, 5, true, CURRENT_DATE(), CURRENT_DATE()),
('P-07Y87257R12876459MSNLAAQ','starter_no_trial','monthly', 3, 2, 5, false, CURRENT_DATE(),CURRENT_DATE()),
('P-2HK07811NK472464TMSNJYRI','premium','monthly', 5, 3, 10, true, CURRENT_DATE(),CURRENT_DATE()),
('P-84S8511897284041AMSNLANA','premium_no_trial', 'monthly', 5, 3, 10, false, CURRENT_DATE(),CURRENT_DATE()),
('P-8NW02791EN569090XMSNJZKY','pro','monthly', 7, 4, 20, true, CURRENT_DATE(),CURRENT_DATE()),
('P-5P3779420G327753MMSNLAVQ','pro_no_trial','monthly', 7, 4, 20, false, CURRENT_DATE(),CURRENT_DATE());

-- 7 days --
insert into ECOMMERCE.paypal_billing_plans(planId,tier,frequency,amount, numberProduct, numberIndex, isTrial ,created_at,updated_at)
values
('P-6BD52515CH8069818MSNOZFQ','starter','monthly', 3, 2, 20, true, CURRENT_DATE(), CURRENT_DATE()),
('P-71R83116Y80649614MSNOZVA','starter_no_trial', 'monthly', 3, 2, 20, false, CURRENT_DATE(), CURRENT_DATE()),
('P-4HR71448Y8776983LMSNO2CY','premium','monthly', 5, 3, 50, true, CURRENT_DATE(),CURRENT_DATE()),
('P-4H466789MB5502423MSNO2JI','premium_no_trial', 'monthly', 5, 3, 50, false, CURRENT_DATE(),CURRENT_DATE()),
('P-5A2117958A9404827MSNO2XQ','pro','monthly', 7, 4, 100, true, CURRENT_DATE(),CURRENT_DATE()),
('P-6X1260512V9779744MSNO25I','pro_no_trial', 'monthly', 7, 4, 100, false, CURRENT_DATE(),CURRENT_DATE());