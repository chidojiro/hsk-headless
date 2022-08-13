import { ComponentStory } from '@storybook/react';
import React from 'react';
import { PromiseUtils } from '@/utils';
import { useInfiniteLoader, UseInfiniteLoaderProps } from './useInfiniteLoader';

export default {
  title: 'Hooks/useInfiniteLoader',
};

const Template: ComponentStory<any> = ({ mode }: Pick<UseInfiniteLoaderProps<any>, 'mode'>) => {
  const handleLoad = async () => {
    await PromiseUtils.sleep(500);
    const data = new Array(10).fill(null).map(() => ({ id: Math.random(), name: Math.random() }));
    setLoadedData(prev => [...prev, ...data] as any);
    return data;
  };

  const [loadedData, setLoadedData] = React.useState([]);

  const ref = React.useRef<HTMLInputElement>(null);

  const { loadMore, isLoading, isExhausted } = useInfiniteLoader({
    mode,
    anchor: ref,
    onLoad: handleLoad,
    until: () => false,
  });

  return (
    <div>
      <div className='mb-4'>
        {loadedData.map(({ id, name }) => (
          <div key={id}>{name}</div>
        ))}
      </div>
      {mode === 'ON_SIGHT' ? (
        <div ref={ref}> {isExhausted ? "That's all!!!" : 'Loading...'}</div>
      ) : (
        <button onClick={loadMore}>{isLoading ? 'Loading...' : 'Load more'}</button>
      )}
    </div>
  );
};

export const OnSight = Template.bind({});
OnSight.args = {
  mode: 'ON_SIGHT',
};

export const OnDemand = Template.bind({});
OnDemand.args = {
  mode: 'ON_DEMAND',
};
