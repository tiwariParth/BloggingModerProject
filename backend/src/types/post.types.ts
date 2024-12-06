export interface CreatePostInput {
     title: string;
     content: string;
     published?: boolean;
   }
   
   export interface UpdatePostInput {
     title?: string;
     content?: string;
     published?: boolean;
   }
   
   export interface PostFilter {
     published?: boolean;
     authorId?: number;
   }