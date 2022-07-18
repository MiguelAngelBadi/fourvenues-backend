export class CreateFeedDto {
     /**
   *The title of the notice
   * @example 'Title'
   */
   readonly title: string;
     /**
   *The body of the notice
   * @example 'Body'
   */
   readonly body: string;
     /**
   *The image of the notice
   * @example 'Image'
   */
   readonly image: string;
     /**
   *The source of the notice
   * @example 'Source'
   */
   readonly source: string;
     /**
   *The publisher of the notice
   * @example 'Publisher'
   */
   readonly publisher: string;
}
