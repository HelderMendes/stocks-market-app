import TradingViewWidget from '@/components/TradingViewWidget';
import {
  HEATMAP_WIDGET_CONFIG,
  MARKET_DATA_WIDGET_CONFIG,
  WatchList_Market_overview_config,
} from '@/lib/constants';

const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

const HomePage = () => {
  return (
    <div className="home-wrapper flex min-h-screen">
      <section className="home-section grid w-full gap-8">
        <div className="md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            title="Market Overview"
            scriptUrl={`${scriptUrl}market-overview.js`}
            config={WatchList_Market_overview_config}
            height={600}
            className="custom-chart"
          />
        </div>

        <div className="md-col-span xl:col-span-2">
          <TradingViewWidget
            title="Stock Heatmap"
            scriptUrl={`${scriptUrl}stock-heatmap.js`}
            config={WatchList_Market_overview_config}
            height={600}
          />
        </div>
      </section>

      <section className="home-section grid w-full gap-8">
        <div className="h-full md:col-span-1 xl:col-span-1">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}timeline.js`}
            config={HEATMAP_WIDGET_CONFIG}
            height={600}
            className="custom-chart"
          />
        </div>

        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingViewWidget
            scriptUrl={`${scriptUrl}market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
