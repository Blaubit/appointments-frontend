import { findCompanySubscription } from "@/actions/subscription/findSubscription";
import { findAll } from "@/actions/plans/findAll";
import { getCompanyId } from "@/actions/user/getCompanyId";
import BillingClient from "./page.client";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const companyId = await getCompanyId();

  if (!companyId) {
    redirect("/login");
  }

  // Obtener la suscripción actual y todos los planes disponibles
  const [subscriptionResult, plansResult] = await Promise.all([
    findCompanySubscription(companyId),
    findAll(),
  ]);

  // Manejar errores de la suscripción
  if (subscriptionResult.status !== 200) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">
            Error loading subscription
          </h2>
          <p className="text-red-600">
            {"message" in subscriptionResult
              ? subscriptionResult.message
              : "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Manejar errores de los planes
  if (plansResult.status !== 200) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error loading plans</h2>
          <p className="text-red-600">{plansResult.message}</p>
        </div>
      </div>
    );
  }
  const currentSubscription =
    "data" in subscriptionResult ? subscriptionResult.data : undefined;

  if (!currentSubscription) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h2 className="text-yellow-800 font-semibold">
            No subscription found
          </h2>
          <p className="text-yellow-700">
            Your company does not have an active subscription. Please contact
            support or choose a plan to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BillingClient
      currentSubscription={currentSubscription}
      availablePlans={"data" in plansResult ? plansResult.data : []}
      companyId={companyId}
    />
  );
}
