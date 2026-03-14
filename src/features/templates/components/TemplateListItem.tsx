import ListItemComponent from '@/components/List/ListItem';
import { Template } from '@/models/templates';

interface TemplateListItemProps {
    one: Template;
    index: number;
    onView: () => void;
    onPreviewInMeta: () => void;
}

function TemplateListItem({ one, onView, onPreviewInMeta }: TemplateListItemProps) {
    return (
        <ListItemComponent openItem={onView}>
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{one.name}</div>
                <div style={{ fontSize: '0.8em', color: '#555' }}>Category: {one.category}</div>
                <div style={{ fontSize: '0.8em', color: '#555' }}>Language: {one.language}</div>
                <div style={{ fontSize: '0.8em', color: '#555' }}>Status: {one.status}</div>
                {one.status?.toUpperCase() === 'APPROVED' ? (
                    <div style={{ marginTop: '6px' }}>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onPreviewInMeta();
                            }}
                            style={{
                                border: 'none',
                                background: 'none',
                                color: '#1976d2',
                                padding: 0,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                fontSize: '0.8em',
                            }}
                        >
                            Preview in Meta
                        </button>
                    </div>
                ) : null}
            </div>
        </ListItemComponent>
    );
}

export default TemplateListItem;
