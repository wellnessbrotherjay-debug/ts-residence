import { isAdminAuthenticated } from "@/lib/admin-auth";
import { isMarketingAuthenticated } from "@/lib/marketing-auth";

export async function isUtmBuilderAuthenticated() {
  const [adminAuthenticated, marketingAuthenticated] = await Promise.all([
    isAdminAuthenticated(),
    isMarketingAuthenticated(),
  ]);

  return adminAuthenticated || marketingAuthenticated;
}

export async function requireUtmBuilderRequest() {
  const authenticated = await isUtmBuilderAuthenticated();
  if (!authenticated) {
    throw new Error("UNAUTHORIZED_UTM_REQUEST");
  }
}
