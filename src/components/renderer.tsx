'use client';

import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';
import { Doc } from '../../convex/_generated/dataModel';

type Props = {
   value: Doc<'messages'>['body'];
};

export default function Renderer({ value }: Props) {
   const [isEmpty, setIsEmpty] = useState(false);
   const rendererRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (!rendererRef.current) return;

      const container = rendererRef.current;
      const quill = new Quill(document.createElement('div'), {
         theme: 'snow',
      });

      quill.enable(false);

      const contents = JSON.parse(value);
      quill.setContents(contents);

      const isEmpty =
         quill
            .getText()
            .replace(/<(.|\n)*?>/g, '')
            .trim().length === 0;
      setIsEmpty(isEmpty);

      container.innerHTML = quill.root.innerHTML;

      return () => {
         if (container) container.innerHTML = '';
      };
   }, [value]);

   if (isEmpty) return null;

   return <div ref={rendererRef} className="ql-editor ql-renderer" />;
}
