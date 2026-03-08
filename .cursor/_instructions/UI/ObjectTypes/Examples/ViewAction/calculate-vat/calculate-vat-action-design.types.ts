import { IViewActionDesignProperties } from '@helix/platform/view/api';

export interface ICalculateVatActionDesignProperties extends IViewActionDesignProperties {
  price: number;
  vatRate: number;
}
