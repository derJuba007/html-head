import Component from 'flarum/Component';
import LoadingIndicator from 'flarum/components/LoadingIndicator';
import Placeholder from 'flarum/components/Placeholder';
import Button from 'flarum/components/Button';
import HeadItemListItem from './HeadItemListItem';
import CreateHeadItemModal from './CreateHeadItemModal';

export default class HeadItemList extends Component {
    oninit(vnode) {
        super.oninit(vnode);

        this.loading = true;

        this.page = 0;
        this.pageSize = 20;
    }

    oncreate(vnode) {
        super.oncreate(vnode);

        this.refresh();
    }

    view() {
        let next, prev;

        if (this.nextResults === true) {
            next = Button.component({
                className: 'Button Button--PageList-next',
                icon: 'fas fa-angle-right',
                onclick: this.loadNext.bind(this),
            });
        }

        if (this.prevResults === true) {
            prev = Button.component({
                className: 'Button Button--PageList-prev',
                icon: 'fas fa-angle-left',
                onclick: this.loadPrev.bind(this),
            });
        }

        return (
            <div>
                <div className="HtmlHeadSettingsPage--controls">
                    {Button.component(
                        {
                            className: 'Button Button--primary',
                            icon: 'fas fa-plus',
                            onclick: () => app.modal.show(CreateHeadItemModal),
                        },
                        app.translator.trans('ianm-html-head.admin.create_button')
                    )}
                </div>
                <br />
                <div className="HtmlHeadSettingsPage-table">
                    {this.loading ? (
                        LoadingIndicator.component()
                    ) : app.store.all('html-headers').length ? (
                        <table style={{ width: '100%', textAlign: 'left' }} className="table">
                            <thead>
                                <tr>
                                    <th>{app.translator.trans('ianm-html-head.admin.table.description_label')}</th>
                                    <th>{app.translator.trans('ianm-html-head.admin.table.header_label')}</th>
                                    <th>{app.translator.trans('ianm-html-head.admin.table.active_label')}</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {app.store
                                    .all('html-headers')
                                    .slice(this.page, this.page + this.pageSize)
                                    .map((headItem) => HeadItemListItem.component({ headItem }))}
                            </tbody>
                        </table>
                    ) : (
                        <div>{Placeholder.component({ text: app.translator.trans('ianm-html-head.admin.table.empty_text') })}</div>
                    )}
                </div>
                <div>
                    {next}
                    {prev}
                </div>
            </div>
        );
    }

    refresh() {
        return this.loadResults().then(this.parseResults.bind(this));
    }

    /**
     * Load a new page of HeadItem results.
     *
     * @param {Integer} page number.
     * @return {Promise}
     */
    loadResults() {
        const offset = this.page * this.pageSize;

        return app.store.find('html-headers', { page: { offset, limit: this.pageSize } });
    }

    /**
     * Load the next page of results.
     *
     * @public
     */
    loadNext() {
        if (this.nextResults === true) {
            this.page++;
            this.refresh();
        }
    }

    /**
     * Load the previous page of results.
     *
     * @public
     */
    loadPrev() {
        if (this.prevResults === true) {
            this.page--;
            this.refresh();
        }
    }

    /**
     * Parse results and append them to the page list.
     *
     * @param {Page[]} results
     * @return {Page[]}
     */
    parseResults(results) {
        this.loading = false;

        this.nextResults = !!results.payload.links.next;
        this.prevResults = !!results.payload.links.prev;

        m.redraw();
    }
}