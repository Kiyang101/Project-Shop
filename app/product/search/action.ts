import product from "@/service/product";
export async function search(query: string) {
  const _product = product();
  return await _product.searchProduct(query);
}
