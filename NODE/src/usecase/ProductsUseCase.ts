import { IProductsRepository } from '../repository/IProductsRepository';
import { ProductsInterface } from '../interface/ProductsInterface';
import { dataProducts } from '../common/dataProduct';
export class ProductsUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async createdProductUseCase(reqBody: ProductsInterface) {
    await Promise.all(
      dataProducts.map(async (item) => {
        await this.productsRepository.created({ nameProduct: item.nameProduct, avatar: item.avatar });
      })
    );
  }

  async updatedProductUseCase(reqBody: ProductsInterface) {
    return await this.productsRepository.updated(reqBody);
  }

  async deletedProductUseCase(productId: string) {
    return await this.productsRepository.deleted(productId);
  }

  async getListsProductsUseCase() {
    return await await this.productsRepository.getLists();
  }

  async getProductByIdUseCase(productId: string) {
    return await this.productsRepository.getProductById(productId);
  }

  async guestGetListUseCase() {
    return await this.productsRepository.getListsWithCondition();
  }
}
